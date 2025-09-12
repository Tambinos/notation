export type Note = {
	id: string;
	title: string;
	info: string;
	owner: char;
	location?: { latitude: number; longitude: number };
	radius?: string; 
	shared?: bool;
};
