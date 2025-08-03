import Logo from '../logo/logo';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

export default function Footer() {
	return (
		<footer className="flex flex-col gap-4 pb-4">
			<Separator />
			<div className="flex justify-between">
				<Logo withText={true} />
				<Button asChild variant="link">
					<a href="mailto: support@mockden.com">support@mockden.com</a>
				</Button>
			</div>
		</footer>
	);
}
