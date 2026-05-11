const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'src', 'nodes');
const distDir = path.resolve(__dirname, '..', 'dist', 'nodes');

if (!fs.existsSync(srcDir)) {
	process.exit(0);
}

const entries = fs.readdirSync(srcDir, { withFileTypes: true });
for (const entry of entries) {
	if (entry.isDirectory()) {
		const svgSrc = path.join(srcDir, entry.name, 'opencodego.svg');
		const svgDist = path.join(distDir, entry.name, 'opencodego.svg');
		if (fs.existsSync(svgSrc)) {
			fs.mkdirSync(path.dirname(svgDist), { recursive: true });
			fs.copyFileSync(svgSrc, svgDist);
		}
	}
}
