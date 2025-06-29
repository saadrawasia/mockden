import { Check, X } from "lucide-react";

type PasswordStrengthIndicatorProps = {
	password: string;
	isVisible: boolean;
};

export default function PasswordStrengthIndicator({
	password,
	isVisible,
}: PasswordStrengthIndicatorProps) {
	const getPasswordStrength = (password: string) => {
		const checks = {
			length: password.length >= 8,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			number: /\d/.test(password),
			special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
		};

		if (!password) return { score: 0, checks, label: "", color: "", bgColor: "" };

		let score = 0;

		score = Object.values(checks).filter(Boolean).length;

		const strengthLevels = {
			0: { label: "", color: "", bgColor: "" },
			1: { label: "Very Weak", color: "text-red-600", bgColor: "bg-red-500" },
			2: { label: "Weak", color: "text-red-500", bgColor: "bg-red-400" },
			3: { label: "Fair", color: "text-yellow-600", bgColor: "bg-yellow-500" },
			4: { label: "Good", color: "text-blue-600", bgColor: "bg-blue-500" },
			5: { label: "Strong", color: "text-green-600", bgColor: "bg-green-500" },
		} as const;

		return {
			score,
			checks,
			...strengthLevels[score as keyof typeof strengthLevels],
		};
	};

	const strength = getPasswordStrength(password);

	if (!isVisible || !password) return null;

	type CheckKey = "length" | "lowercase" | "uppercase" | "number" | "special";

	return (
		<div className="mt-3 space-y-3">
			{/* Strength meter */}
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<span className="font-medium text-gray-700 text-sm">Password Strength</span>
					<span className={`font-medium text-sm ${strength.color}`}>{strength.label}</span>
				</div>
				<div className="flex space-x-1">
					{[1, 2, 3, 4, 5].map(level => (
						<div
							key={level}
							className={`h-2 flex-1 rounded-full ${
								level <= strength.score ? strength.bgColor : "bg-gray-200"
							} transition-colors duration-300`}
						/>
					))}
				</div>
			</div>

			{/* Requirements checklist */}
			<div className="space-y-2">
				<h4 className="font-medium text-gray-700 text-sm">Requirements:</h4>
				<div className="grid grid-cols-1 gap-1 text-sm">
					{(
						[
							{ key: "length", label: "At least 8 characters" },
							{ key: "lowercase", label: "One lowercase letter" },
							{ key: "uppercase", label: "One uppercase letter" },
							{ key: "number", label: "One number" },
							{ key: "special", label: "One special character" },
						] as { key: CheckKey; label: string }[]
					).map(({ key, label }) => (
						<div
							key={key}
							className={`flex items-center space-x-2 ${
								strength.checks?.[key] ? "text-green-600" : "text-gray-500"
							}`}
						>
							{strength.checks?.[key] ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
							<span>{label}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
