const generateRandomString = (length: number, chars?: string): string => {
	let result: string = '';
	const characters: string =
		chars ?? 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength: number = characters.length;
	for (let i = 0; i < length; ++i) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
};

export default generateRandomString;
