"use client";

import { useEffect, useState } from "react";
import { Group, Code, Button, Stack, Blockquote } from "@mantine/core";
import {
  IconBellRinging,
  IconMovie,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconShoppingCartFilled,
  IconTruckDelivery,
} from "@tabler/icons-react";
import classes from "./NavbarSimple.module.css";
import { usePathname } from "next/navigation";

export function NavbarSimple({ loggedIn }: { loggedIn: boolean }) {
  const pathname = usePathname();
  const [active, setActive] = useState("Billing");

  const data = [
    { link: "/movies", label: "Movies", icon: IconMovie, disabled: false },
    {
      link: "/basket",
      label: "Basket",
      icon: IconShoppingCartFilled,
      disabled: !loggedIn,
    },
    {
      link: "/orders",
      label: "Orders",
      icon: IconTruckDelivery,
      disabled: !loggedIn,
    },
  ];

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const links = data.map((item) => (
    <Button
      component="a"
      className={classes.link}
      href={item.link}
      key={item.label}
      disabled={item.disabled}
      variant={active.startsWith(item.link) ? "filled" : "light"}
      autoContrast
      onClick={(event) => {
        item.disabled && event.preventDefault();
      }}
    >
      <item.icon color="black" className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Button>
  ));

  const isMobile = window.innerWidth < 768;

  const sideQuote = isMobile
    ? "I am sorry but the site does not work on small screens. Try a laptop's screen or larger."
    : "Explore movies effortlessly with our search website: find films by " +
      "director, genres, time period, or search by title/description. Your " +
      "selections influence auto-suggestions in other fields for a seamless " +
      "search experience.";

  const siteDescription = (
    <Blockquote className="text-xl italic font-semibold text-gray-900 dark:text-white">
      {sideQuote}
    </Blockquote>
  );

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Stack>{links.concat(siteDescription)}</Stack>
      </div>

      <div className={classes.footer}></div>
    </nav>
  );
}
