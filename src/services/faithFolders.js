import { base44 } from '../api/base44Client';
import { currentUser } from './faithLibrary';

export async function listMyFaithFolders() {
  const user = await currentUser();
  return base44.entities.FaithFolder.filter({ owner_user_id: user.id }, 'position', 200);
}

export async function createFaithFolder(name) {
  const cleanName = String(name || '').trim().slice(0, 120);
  if (!cleanName) throw new Error('folder_name_required');
  const user = await currentUser();
  const existing = await base44.entities.FaithFolder.filter({ owner_user_id: user.id }, 'position', 200);
  const match = (existing || []).find((folder) => folder.name?.trim().toLowerCase() === cleanName.toLowerCase());
  if (match) return match;
  const now = new Date().toISOString();
  return base44.entities.FaithFolder.create({
    owner_user_id: user.id,
    parent_folder_id: '',
    name: cleanName,
    position: existing?.length || 0,
    created_at: now,
    updated_at: now,
  });
}