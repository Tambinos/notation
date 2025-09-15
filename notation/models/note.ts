import {Coordinates} from "./coordinates";

export type Note = {
	id: string;
	title: string;
	info: string;
	owner: string;
	location?: Coordinates;
	radius?: string; 
	shared?: boolean;
};
