import Logo from '../logo/logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdownMenu';
import { Separator } from '../ui/separator';

export default function Navbar() {
  const isUserLoggedIn = true;

  return (
    <nav className="flex justify-between">
      <Logo withText={true} />
      {isUserLoggedIn
        ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="flex flex-col gap-2">
                <DropdownMenuItem className="cursor-pointer hover:bg-transparent">
                  <Button type="button" variant="ghost">
                    User Settings
                  </Button>
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem className="cursor-pointer  hover:bg-transparent">
                  <Button type="button" variant="ghost">
                    Logout
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
