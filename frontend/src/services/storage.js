import { supabase } from "../lib/supabase";

export async function uploadBusinessLogo(file) {

  const fileExt = file.name.split(".").pop();

  const fileName = `logo-${Date.now()}.${fileExt}`;

  const filePath = `logos/${fileName}`;

  const { error } = await supabase.storage
    .from("business-assets")
    .upload(filePath, file);

  if (error) {

    throw error;

  }

  const { data } = supabase.storage
    .from("business-assets")
    .getPublicUrl(filePath);

  return data.publicUrl;

}
