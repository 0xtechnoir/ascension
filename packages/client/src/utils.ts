export const parseError = (error: any) => {
    const json = JSON.stringify(error, null, 2)
    const parsed = JSON.parse(json);
    return parsed.reason;
  }
