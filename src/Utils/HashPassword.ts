import bcrypt from 'bcrypt'

export const Encode = (plainText: string)  => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(plainText, salt);
}

export const Decode = (plainText: string, hash: string)  => bcrypt.compareSync(plainText, hash) 