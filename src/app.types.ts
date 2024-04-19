export const HiddenServiceKeywords = { profile: 'HIDDENSERVICE_PROFILE', port: 'HIDDENSERVICE_PORT', namespace: 'HIDDENSERVICE_NAMESPACE' };

export type HiddenServiceIdentifier = {
	profile: string;
	hostname: string;
	namespace?: string;
	port?: number;
};
