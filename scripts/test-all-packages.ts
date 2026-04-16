#!/usr/bin/env bun

/**
 * Run tests across all packages and provide a consolidated summary
 */

import { spawnSync } from 'child_process';
import { existsSync, readdirSync } from 'fs';
import { join } from 'path';

interface PackageTestResult {
  name: string;
  passed: boolean;
  testsRun: number;
  testsPassed: number;
  testsFailed: number;
  duration: number;
  output: string;
  error?: string;
}

function getPackages(): string[] {
  const packagesDir = join(process.cwd(), 'packages');
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => {
      // Check if package has a package.json with test script
      const pkgPath = join(packagesDir, name, 'package.json');
      return existsSync(pkgPath);
    })
    .sort(); // Sort alphabetically for consistent output
}

function parseTestOutput(output: string): { passed: number; failed: number } {
  // Parse Bun test output format
  // Look for lines like: " 236 pass" and " 0 fail"
  let passed = 0;
  let failed = 0;

  const passMatch = output.match(/(\d+)\s+pass/);
  const failMatch = output.match(/(\d+)\s+fail/);

  if (passMatch) passed = parseInt(passMatch[1]);
  if (failMatch) failed = parseInt(failMatch[1]);

  return { passed, failed };
}

function runPackageTest(packageName: string, showOutput = true): PackageTestResult {
  const packageDir = join(process.cwd(), 'packages', packageName);

  if (showOutput) {
    console.log(`\n${'='.repeat(70)}`);
    console.log(`📦 Testing: ${packageName}`);
    console.log('='.repeat(70) + '\n');
  }

  const startTime = Date.now();

  const result = spawnSync('bun', ['test'], {
    cwd: packageDir,
    encoding: 'utf-8',
    stdio: showOutput ? 'inherit' : 'pipe',
    maxBuffer: 10 * 1024 * 1024,
  });

  const duration = Date.now() - startTime;
  const output = (result.stdout || '') + (result.stderr || '');

  const { passed: testsPassed, failed: testsFailed } = parseTestOutput(output);
  const testsRun = testsPassed + testsFailed;

  const passed = result.status === 0;

  return {
    name: packageName,
    passed,
    testsRun,
    testsPassed,
    testsFailed,
    duration,
    output,
    error: result.error?.message,
  };
}

function printSummary(results: PackageTestResult[]) {
  console.log('\n\n' + '═'.repeat(80));
  console.log('📊 GLOBAL TEST SUMMARY');
  console.log('═'.repeat(80));

  const totalPkgPassed = results.filter(r => r.passed).length;
  const totalPkgFailed = results.filter(r => !r.passed).length;
  const totalTestsRun = results.reduce((sum, r) => sum + r.testsRun, 0);
  const totalTestsPassed = results.reduce((sum, r) => sum + r.testsPassed, 0);
  const totalTestsFailed = results.reduce((sum, r) => sum + r.testsFailed, 0);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log('\n📋 Package Results:');
  console.log('─'.repeat(80));
  console.log('Status | Package Name                              | Tests  | Time    ');
  console.log('─'.repeat(80));

  for (const result of results) {
    const status = result.passed ? '  ✅  ' : '  ❌  ';
    const testInfo = result.testsRun > 0
      ? `${result.testsPassed}/${result.testsRun}`.padStart(6)
      : '  N/A ';
    const time = `${(result.duration / 1000).toFixed(2)}s`.padStart(8);
    const name = result.name.padEnd(40);

    console.log(`${status} | ${name} | ${testInfo} | ${time}`);

    if (result.error) {
      console.log(`       └─ Error: ${result.error}`);
    }
    if (!result.passed && result.testsFailed > 0) {
      console.log(`       └─ ${result.testsFailed} test(s) failed`);
    }
  }

  console.log('─'.repeat(80));

  // Overall Statistics
  console.log('\n📈 Overall Statistics:');
  console.log('┌─────────────────────────────────────────────────────────────────────┐');
  console.log(`│  Packages:       ${String(results.length).padStart(3)} total  |  ${String(totalPkgPassed).padStart(3)} passed  |  ${String(totalPkgFailed).padStart(3)} failed      │`);
  console.log(`│  Tests:          ${String(totalTestsRun).padStart(3)} total  |  ${String(totalTestsPassed).padStart(3)} passed  |  ${String(totalTestsFailed).padStart(3)} failed      │`);
  console.log(`│  Duration:       ${(totalDuration / 1000).toFixed(2)}s total                                      │`);
  console.log('└─────────────────────────────────────────────────────────────────────┘');

  // Pass rate
  const testPassRate = totalTestsRun > 0 ? (totalTestsPassed / totalTestsRun * 100).toFixed(1) : '0.0';
  const pkgPassRate = results.length > 0 ? (totalPkgPassed / results.length * 100).toFixed(1) : '0.0';

  console.log('\n📊 Success Rate:');
  console.log(`   Tests:    ${testPassRate}% (${totalTestsPassed}/${totalTestsRun})`);
  console.log(`   Packages: ${pkgPassRate}% (${totalPkgPassed}/${results.length})`);

  console.log('═'.repeat(80));

  if (totalPkgFailed > 0 || totalTestsFailed > 0) {
    console.log('\n❌ Some tests failed. Review the output above for details.\n');

    // List failed packages
    const failedPkgs = results.filter(r => !r.passed);
    if (failedPkgs.length > 0) {
      console.log('Failed packages:');
      failedPkgs.forEach(pkg => {
        console.log(`  • ${pkg.name}`);
      });
      console.log();
    }

    process.exit(1);
  } else {
    console.log('\n✅  All package tests passed successfully!\n');
    process.exit(0);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const quiet = args.includes('--quiet') || args.includes('-q');
  const summary = args.includes('--summary') || args.includes('-s');

  console.log('🧪 Running tests across all packages...\n');

  const packages = getPackages();

  if (packages.length === 0) {
    console.error('❌ No packages found in ./packages directory');
    process.exit(1);
  }

  if (!quiet && !summary) {
    console.log(`Found ${packages.length} packages to test:\n`);
    packages.forEach(pkg => console.log(`  • ${pkg}`));
  }

  const results: PackageTestResult[] = [];
  const showIndividualOutput = !summary;

  for (const packageName of packages) {
    const result = runPackageTest(packageName, showIndividualOutput);
    results.push(result);

    // Show inline summary if in summary mode
    if (summary) {
      const status = result.passed ? '✅ ' : '❌';
      const tests = result.testsRun > 0 ? `${result.testsPassed}/${result.testsRun}` : 'N/A';
      console.log(`${status} ${packageName.padEnd(40)} ${tests.padStart(8)} (${(result.duration / 1000).toFixed(2)}s)`);
    }
  }

  printSummary(results);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

