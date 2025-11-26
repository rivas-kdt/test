"use server";
export const fetchParts = async () => {
  const response = await fetch(
    "https://xmon-sys.vercel.app/api/v2/inventory/test"
  );
  const data2 = await response.json();
  return data2;
};
