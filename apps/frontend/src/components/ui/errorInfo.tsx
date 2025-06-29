import type { AnyFieldApi } from "@tanstack/react-form";

import { TypographyCaption } from "../typography/typography";

export function ErrorInfo({ field }: { field: AnyFieldApi }) {
	return field.state.meta.isTouched && !field.state.meta.isValid ? (
		<TypographyCaption className="text-destructive">{field.state.meta.errors[0]}</TypographyCaption>
	) : null;
}
