import moment from 'moment';

export const formatDate = (timestamp: number) => {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}


export const parseError = (error: any) => {
  const json = JSON.stringify(error, null, 2);
  const parsed = JSON.parse(json);
  return parsed.reason;
};