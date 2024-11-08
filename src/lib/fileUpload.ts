import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export async function uploadFile(
  userId: string,
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    // Sanitize filename and create a unique name
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = file.name.split('.').pop();
    const sanitizedName = `${timestamp}-${randomString}.${extension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `projects/${userId}/${sanitizedName}`);

    // Set metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        uploadedBy: userId,
        timestamp: timestamp.toString()
      }
    };

    // Create and monitor upload task
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.({
            progress,
            status: 'uploading'
          });
        },
        (error) => {
          console.error('Upload error:', error);
          onProgress?.({
            progress: 0,
            status: 'error',
            error: error.message
          });
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.({
              progress: 100,
              status: 'completed'
            });
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            onProgress?.({
              progress: 0,
              status: 'error',
              error: 'Failed to get download URL'
            });
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload setup error:', error);
    onProgress?.({
      progress: 0,
      status: 'error',
      error: 'Failed to start upload'
    });
    throw error;
  }
}