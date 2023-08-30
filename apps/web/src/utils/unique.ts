export default function unique<T>(input: T[], key?: keyof T) {
	if (!key) return [...new Set(input)];

	return [...new Set(input.map((i) => i[key]))].map((value) => input.find((i) => i[key] === value)!);
}
