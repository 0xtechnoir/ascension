export const parseError = (error: any) => {
  const json = JSON.stringify(error, null, 2);
  const parsed = JSON.parse(json);
  return parsed.reason;
};

export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return formattedDate;
}
