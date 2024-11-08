-- Enable RLS
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  username text,
  role text check (role in ('client', 'developer', 'team_manager', 'executive')),
  designation text,
  company text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Create connections table
create table public.connections (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  professional_id uuid references public.profiles(id) on delete cascade,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  category text not null,
  client_id uuid references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete cascade,
  status text check (status in ('pending', 'active', 'completed')) default 'pending',
  delivery_date timestamp with time zone not null,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create project_files table
create table public.project_files (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  name text not null,
  file_path text not null,
  size bigint not null,
  type text not null,
  uploaded_by uuid references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.connections enable row level security;
alter table public.projects enable row level security;
alter table public.project_files enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can view connections they are part of"
  on public.connections for select
  using (
    auth.uid() = client_id or 
    auth.uid() = professional_id
  );

create policy "Clients can create connections"
  on public.connections for insert
  with check (auth.uid() = client_id);

create policy "Users can view their projects"
  on public.projects for select
  using (
    auth.uid() = client_id or 
    auth.uid() = assigned_to
  );

create policy "Clients can create projects"
  on public.projects for insert
  with check (auth.uid() = client_id);

create policy "Project members can update projects"
  on public.projects for update
  using (
    auth.uid() = client_id or 
    auth.uid() = assigned_to
  );

create policy "Users can view project files they have access to"
  on public.project_files for select
  using (
    exists (
      select 1 from public.projects
      where projects.id = project_files.project_id
      and (
        projects.client_id = auth.uid() or 
        projects.assigned_to = auth.uid()
      )
    )
  );

create policy "Project members can upload files"
  on public.project_files for insert
  with check (
    exists (
      select 1 from public.projects
      where projects.id = project_files.project_id
      and (
        projects.client_id = auth.uid() or 
        projects.assigned_to = auth.uid()
      )
    )
  );

-- Create indexes
create index profiles_email_idx on public.profiles(email);
create index connections_client_id_idx on public.connections(client_id);
create index connections_professional_id_idx on public.connections(professional_id);
create index projects_client_id_idx on public.projects(client_id);
create index projects_assigned_to_idx on public.projects(assigned_to);
create index project_files_project_id_idx on public.project_files(project_id);