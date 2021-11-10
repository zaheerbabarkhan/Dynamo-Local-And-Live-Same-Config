export default {
	type: 'object',
	properties: {
		ID: { type: 'string' },
		name: { type: 'string' },
		age: { type: 'number' },
	},
	required: ['name', 'ID', 'age'],
} as const;
