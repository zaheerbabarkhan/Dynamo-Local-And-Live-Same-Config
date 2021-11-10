export default {
	type: 'object',
	properties: {
		ID: { type: 'string' },
		name: { type: 'string' },
	},
	required: ['name', 'ID'],
} as const;
