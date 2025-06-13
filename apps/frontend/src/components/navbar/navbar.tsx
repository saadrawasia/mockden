import Logo from '../logo/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

export default function Navbar() {
  const isUserLoggedIn = false;

  return (
    <nav className="flex justify-between">
      <Logo withText={true} />
      {isUserLoggedIn
        ? (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )
        : (
            <div className="flex items-center gap-2">
              <Button>Log In</Button>
              <Button variant="outline">Sign Up</Button>
            </div>
          )}
    </nav>
  );
}
