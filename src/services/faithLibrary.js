import { base44 } from '../api/base44Client';

export async function currentUser(){ return base44.auth.me(); }

export async function saveFaithItem(item){
  const user = await currentUser();
  return base44.entities.FaithItem.create({
    owner_user_id:user.id,
    profile_id:item.profile_id || '',
    kind:item.kind,
    title:item.title || '',
    text:item.text || '',
    scripture_ref:item.scripture_ref || item.ref || '',
    color:item.color || '',
    tags:item.tags || [],
    visibility:item.visibility || 'private',
    group_id:item.group_id || '',
    source_item_id:item.source_item_id || '',
    folder_id:item.folder_id || '',
    current_version_id:item.current_version_id || '',
    generator_type:item.generator_type || '',
    generator_settings:item.generator_settings || null,
    source_snapshot:item.source_snapshot || null,
    spatial:item.spatial || null,
    created_at:new Date().toISOString(),
    updated_at:new Date().toISOString(),
  });
}

export async function listMyFaithItems(){
  const user = await currentUser();
  return base44.entities.FaithItem.filter({owner_user_id:user.id},'-created_at',200);
}

export async function deleteFaithItem(itemId){
  if (!itemId) throw new Error('item_id_required');
  return base44.entities.FaithItem.delete(itemId);
}

export async function updateFaithItemPosition(itemId, spatial){
  if (!itemId) throw new Error('item_id_required');
  return base44.entities.FaithItem.update(itemId, {
    spatial: spatial || null,
    updated_at: new Date().toISOString(),
  });
}