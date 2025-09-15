export type Note = {
	id: string;
	title: string;
	info: string;
	owner: string;
	location?: { latitude: number; longitude: number };
	radius?: string; 
	shared?: boolean;
};
