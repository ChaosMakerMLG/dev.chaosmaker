type BrandedChar = string & { readonly __brand: unique symbol };

export class Char {
	private readonly value: BrandedChar;

	private constructor(char: string) {
		if (char.length !== 1) {
			throw new Error('Char must be exactly one character');
		}
		this.value = char as BrandedChar;
	}

	static from(char: string): Char {
		return new Char(char);
	}

	valueOf(): string {
		return this.value;
	}

	toString(): string {
		return this.value;
	}

	charCode(): number {
		return this.value.charCodeAt(0);
	}

	isDigit(): boolean {
		return /^\d$/.test(this.value);
	}

	isLetter(): boolean {
		return /^[a-zA-Z]$/.test(this.value);
	}

	isAlphanumeric(): boolean {
		return /^[a-zA-Z0-9]$/.test(this.value);
	}

	isWhitespace(): boolean {
		return /^\s$/.test(this.value);
	}

	isUpperCase(): boolean {
		return this.value === this.value.toUpperCase() && this.value !== this.value.toLowerCase();
	}

	isLowerCase(): boolean {
		return this.value === this.value.toLowerCase() && this.value !== this.value.toUpperCase();
	}

	toUpperCase(): Char {
		return Char.from(this.value.toUpperCase());
	}

	toLowerCase(): Char {
		return Char.from(this.value.toLowerCase());
	}

	equals(other: Char): boolean {
		return this.value === other.value;
	}

	equalsIgnoreCase(other: Char): boolean {
		return this.value.toLowerCase() === other.value.toLowerCase();
	}

	static fromCharCode(charCode: number): Char {
		return Char.from(String.fromCharCode(charCode));
	}
}
