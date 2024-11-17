import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
} from './types/config'
import { LinkPreset } from './types/config'

//try password for blog

import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      published_at: z.date(),
      modified_at: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      password: z.string().optional(),
    }),
});

export const collections = { blog };

export const siteConfig: SiteConfig = {
  title: 'JA\'s Personal Blog',
  subtitle: 'Welcome(^_^)',
  lang: 'zh_CN',         // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko'
  themeColor: {
    hue: 250,         // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false,     // Hide the theme color picker for visitors
  },
  banner: {
    enable: true,
    src: 'assets/images/Lobotomy_Corporation.jpg',   // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: 'center',      // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
    credit: {
      enable: false,         // Display the credit text of the banner image
      text: '',              // Credit text to be displayed
      url: ''                // (Optional) URL link to the original artwork or artist's page
    }
  },
  favicon: [    // Leave this array empty to use the default favicon
    // {
    //   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
    //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
    //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    // }
  ]
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.About,
    {
      name: 'GitHub',
      url: 'https://github.com/JA101617',     // Internal links should not include the base path, as it is automatically added
      external: true,                               // Show an external link icon and will open in a new tab
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/JA-avatar.jpg',  // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: 'JA',
  bio: 'A typical sophomore majoring in Computer Science and Technology, currently working hard to learn about machine learning.',
  links: [
  //   {
  //     name: 'Twitter',
  //     icon: 'fa6-brands:twitter',       // Visit https://icones.js.org/ for icon codes
  //                                       // You will need to install the corresponding icon set if it's not already included
  //                                       // `pnpm add @iconify-json/<icon-set-name>`
  //     url: 'https://twitter.com',
  //   },
  //   {
  //     name: 'Steam',
  //     icon: 'fa6-brands:steam',
  //     url: 'https://store.steampowered.com',
  //   },
  //   {
  //     name: 'GitHub',
  //     icon: 'fa6-brands:github',
  //     url: 'https://github.com/saicaca/fuwari',
  //   },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}
