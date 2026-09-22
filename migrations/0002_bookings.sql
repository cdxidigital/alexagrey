create table if not exists bookings (
  id            serial primary key,
  name          text not null,
  email         text not null,
  phone         text not null,
  duration      text not null,
  preferred_at  text not null default '',
  location      text not null,
  extras        jsonb not null default '[]'::jsonb,
  message       text not null default '',
  status        text not null default 'new',
  notes         text not null default '',
  created_at    timestamptz not null default now()
);

create index if not exists bookings_status_idx on bookings (status);
create index if not exists bookings_created_at_idx on bookings (created_at desc);
