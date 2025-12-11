import puppeteer from 'puppeteer';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5173';

async function runTests() {
  console.log('Starting E2E tests...');
  console.log(`Testing URL: ${BASE_URL}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Set viewport to mobile size
  await page.setViewport({ width: 390, height: 844 });

  let passed = 0;
  let failed = 0;

  // Test 1: Page loads
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    const title = await page.title();
    if (title === 'Slow Eating') {
      console.log('✓ Test 1: Page title is correct');
      passed++;
    } else {
      throw new Error(`Expected title "Slow Eating", got "${title}"`);
    }
  } catch (e) {
    console.log('✗ Test 1: Page title check failed -', e.message);
    failed++;
  }

  // Test 2: Start button exists
  try {
    const startButton = await page.$('button');
    const buttonText = await page.evaluate(el => el.textContent, startButton);
    if (buttonText.includes('Start Meal')) {
      console.log('✓ Test 2: Start Meal button exists');
      passed++;
    } else {
      throw new Error('Start Meal button not found');
    }
  } catch (e) {
    console.log('✗ Test 2: Start button check failed -', e.message);
    failed++;
  }

  // Test 3: Settings button exists
  try {
    const settingsButton = await page.$('button[aria-label="Settings"]');
    if (settingsButton) {
      console.log('✓ Test 3: Settings button exists');
      passed++;
    } else {
      throw new Error('Settings button not found');
    }
  } catch (e) {
    console.log('✗ Test 3: Settings button check failed -', e.message);
    failed++;
  }

  // Test 4: Can start a meal
  try {
    const startButton = await page.$('button');
    await startButton.click();
    await page.waitForSelector('text/End Meal', { timeout: 5000 });
    console.log('✓ Test 4: Can start a meal');
    passed++;
  } catch (e) {
    console.log('✗ Test 4: Start meal failed -', e.message);
    failed++;
  }

  // Test 5: Timer is running
  try {
    await page.waitForFunction(
      () => {
        const timerText = document.body.innerText;
        return timerText.includes('0:0') || timerText.includes('0:01') || timerText.includes('0:02');
      },
      { timeout: 5000 }
    );
    console.log('✓ Test 5: Timer is running');
    passed++;
  } catch (e) {
    console.log('✗ Test 5: Timer check failed -', e.message);
    failed++;
  }

  // Test 6: Can end meal
  try {
    const endButton = await page.$('button');
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('End Meal')) {
        await btn.click();
        break;
      }
    }
    await page.waitForSelector('text/Great Job', { timeout: 5000 });
    console.log('✓ Test 6: Can end meal and see completion screen');
    passed++;
  } catch (e) {
    console.log('✗ Test 6: End meal failed -', e.message);
    failed++;
  }

  // Test 7: Can return to start screen
  try {
    const buttons = await page.$$('button');
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text.includes('Done')) {
        await btn.click();
        break;
      }
    }
    await page.waitForSelector('text/Start Meal', { timeout: 5000 });
    console.log('✓ Test 7: Can return to start screen');
    passed++;
  } catch (e) {
    console.log('✗ Test 7: Return to start failed -', e.message);
    failed++;
  }

  // Test 8: Settings screen works
  try {
    const settingsButton = await page.$('button[aria-label="Settings"]');
    await settingsButton.click();
    await page.waitForSelector('text/Reminder Interval', { timeout: 5000 });
    console.log('✓ Test 8: Settings screen opens');
    passed++;
  } catch (e) {
    console.log('✗ Test 8: Settings screen failed -', e.message);
    failed++;
  }

  await browser.close();

  console.log('\n--- Test Results ---');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(e => {
  console.error('Test runner error:', e);
  process.exit(1);
});
