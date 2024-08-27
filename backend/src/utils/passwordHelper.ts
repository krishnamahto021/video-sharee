import bcrypt from "bcrypt";

export const hashPassword = async (
  originalPassword: string
): Promise<string> => {
  console.log(originalPassword);

  const saltRounds: number = 10;
  const hashedPassword = await bcrypt.hash(originalPassword, saltRounds);

  return hashedPassword;
};

export const compareHashedPassword = async (
  originalPassword: string,
  dbPasssword: string
): Promise<boolean> => {
  const res = await bcrypt.compare(originalPassword, dbPasssword);
  return res;
};
