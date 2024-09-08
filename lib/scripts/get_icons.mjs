import fs from 'fs';

import * as fa from 'react-icons/fa';
import * as fa6 from 'react-icons/fa6';
import * as lu from 'react-icons/lu';
import * as ri from 'react-icons/ri';
import * as bs from 'react-icons/bs';
import * as io from 'react-icons/io';

const icon_modules = [
  fa,
  fa6,
  // lu,
  // ri,
  // bs,
  // io
];

const icon_names = icon_modules
  .map((icon_module) => Object.keys(icon_module))
  .flat();

const icon_names_set = new Set(icon_names);

fs.writeFileSync(
  'lib/scripts/icon_names.json',
  JSON.stringify(Array.from(icon_names_set), null, 2),
);

const icon_codes = {};

icon_names.forEach((icon_name) => {
  icon_codes[icon_name] =
    `import { ${icon_name} } from "react-icons/${icon_name.slice(0, 2).toLowerCase()}"`;
});

fs.writeFileSync(
  'lib/scripts/icon_codes.json',
  JSON.stringify(icon_codes, null, 2),
);
