import { SignedIn, SignedOut, SignOutButton } from '@clerk/clerk-react';
import { Link, useNavigate } from '@tanstack/react-router';

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
  const navigate = useNavigate();
  return (
    <nav className="flex justify-between">
      <Logo withText={true} />

      <SignedOut>
        <div className="flex items-center gap-2">
          <Button onClick={() => navigate({
            to: '/sign-in',
          })}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate({
              to: '/sign-up',
            })}
          >
            Sign Up
          </Button>
        </div>
      </SignedOut>
      <SignedIn>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-2">
            <DropdownMenuItem className="cursor-pointer hover:bg-transparent">
              <Link to="/user-settings">
                <Button type="button" variant="ghost">
                  User Settings
                </Button>
              </Link>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem className="cursor-pointer  hover:bg-transparent">
              <Link to="/">
                <Button type="button" variant="ghost" asChild>
                  <SignOutButton />
                </Button>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SignedIn>

    </nav>
  );
}
