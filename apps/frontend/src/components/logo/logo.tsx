import Logo64 from '@frontend/assets/mockden64.png';

import { TypographyH5 } from '../typography/typography';

type LogoProps = {
	withText?: boolean;
};

export default function Logo({ withText = false }: LogoProps) {
	return (
		<div className="flex items-center gap-2">
			<img src={Logo64} alt="logo" width={32} height={32} />
			{withText && <TypographyH5>mockden</TypographyH5>}
		</div>
	);
}
