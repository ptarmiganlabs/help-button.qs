import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Look for tests in src only.  By default Vitest looks everywhere
        // except node_modules and .git, so in the main checkout it would also
        // run the tests of every worktree under .claude/worktrees.
        include: ['src/**/*.test.js'],
    },
});
