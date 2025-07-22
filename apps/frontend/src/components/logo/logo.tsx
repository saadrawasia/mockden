import Logo64 from '@frontend/assets/mockden64.png';

import { useUser } from '@clerk/clerk-react';
import { Link } from '@tanstack/react-router';
import { TypographyH5 } from '../typography/typography';

type LogoProps = {
	withText?: boolean;
};

export default function Logo({ withText = false }: LogoProps) {
	const { isSignedIn } = useUser();
	const url = isSignedIn ? '/projects' : '/';
	return (
		<Link to={url} className="flex items-center gap-2">
			<img src={Logo64} alt="logo" width={32} height={32} />
			{withText && <TypographyH5 className="hidden select-none md:block">mockden</TypographyH5>}
		</Link>
	);
}
