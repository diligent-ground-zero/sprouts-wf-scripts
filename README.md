# Tuned social Webflow page scripts & styles

This project includes scripts used to extend the default capabilities of Webflow. Also includes some decoupled styles used on the site.

The Website staging link is available here: https://tuned-social-8336d7.webflow.io/

**The project includes:**

- Only Vanilla Javascript (global and Page specific outputs generated in `/dist`) 
- A Minimal Vite setup for bundling and asset handling
- A minimal Prettier & ESLint setup

## Development 💻

1. Standard setup `yarn && yarn dev`.
2. A local dev server will be spun up on `localhost:3000` 
3. To develop inside the Webflow designer select a file like `main.js`
and include it in the `head` section of the Project or Page settings:

`<script type="module" src="http://localhost:3000/src/scripts/main.js"></script>`


## Deployment 🚀

The scripts and styles are intended to be deployed via CDN.
We used JSdelivr's (https://www.jsdelivr.com/) free CDN Github mirroring to host and serve the projects files in `/dist`.


1. `yarn build`, push changes to Github and create a version Tag
2. Create a new Release in Github
3. Go to https://www.jsdelivr.com/github and convert the Tagged repo version following this structure: `https://cdn.jsdelivr.net/gh/user/repo@version/file`
4. Insert the generated scripts CDN URL's into Webflow (either in the global HEAD or site specific HEAD)
