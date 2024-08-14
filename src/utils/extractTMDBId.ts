// Function to extract tmdb_id from folder title
function extractTMDBId(folderName: string): string | null {
  const match = folderName.match(/\{tmdb-(\d+)\}/);
  return match ? match[1] : null;
}

export default extractTMDBId;
