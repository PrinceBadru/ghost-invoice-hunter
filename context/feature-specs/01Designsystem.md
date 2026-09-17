Read `AGENTS.md` before starting .

we are adding the design system and Ui primitive components
Install and configure `shadcn/ui`

add the shad cn components :
-Button
-Card
-Dialog
-Input
-Tabs
-Textarea
-ScrollArea
-Table
-DropdownMenu

Donot modify The generated `components/ui/*` files after installation .
Also install `lucide-react`

create a `lib/utils.ts` with a reusable`cn()` helper for merging tailwind classes.

Ensure all components  are in dark theme and make it the primary theme of the project  and add this change to `globals.css` 

## Check when done
-All components import without errors 
-`cn()` works properly
-no default light styling appears

After adding all the components, create a PR to merge the changes.