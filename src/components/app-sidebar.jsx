import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { LoginButton } from "./custom/LoginButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser, selectCurrentUser } from "../store/userSlice";
import { useEffect } from "react";

const data = {
  user: {
    name: "Azeem Arshad",
    email: "azeem.arshad@wamolabs.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Posts",
      url: "/posts",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Create new Post",
          url: "/post/create",
        },
        {
          title: "My Posts",
          url: "/user/posts",
        },
        {
          title: "My Comments",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(selectCurrentUser);

  function handleLogin() {
    navigate("/login");
  }

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                {/* Icon / Logo */}
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  {/* Use a book icon for a blog */}
                  <BookOpen className="size-4" />
                </div>

                {/* Blog name */}
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">My Blog</span>
                  <span className="truncate text-xs">Thoughts & Stories</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <LoginButton onClick={handleLogin} />}
      </SidebarFooter>
    </Sidebar>
  );
}
