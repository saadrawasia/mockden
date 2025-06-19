import { SignedIn, SignedOut, SignOutButton, useUser } from '@clerk/clerk-react';
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
  const { user } = useUser();
  const userInitials = `${user?.firstName?.[0].toUpperCase() ?? ''}${user?.lastName?.[0].toUpperCase() ?? ''}`;

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
              <AvatarImage src="" />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-2">
            <DropdownMenuItem className="cursor-pointer hover:bg-transparent">
              <Link to="/projects">
                <Button type="button" variant="link" className="hover:no-underline">
                  Projects
                </Button>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-transparent">
              <Link to="/user-settings">
                <Button type="button" variant="link" className="hover:no-underline">
                  User Settings
                </Button>
              </Link>
            </DropdownMenuItem>
            <Separator />
            <DropdownMenuItem className="cursor-pointer  hover:bg-transparent">
              <Link to="/">
                <Button type="button" variant="link" className="hover:no-underline" asChild>
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
