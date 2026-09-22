const ALCHEMY_KEY = 'YOUR_ALCHEMY_KEY'; // move server-side before deploying

async function fetchTokenPrice(address, network = 'base-mainnet') {
  const res = await fetch(
    `https://api.g.alchemy.com/prices/v1/${ALCHEMY_KEY}/tokens/by-address`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        addresses: [{ network, address }],
      }),
    }
  );
  const data = await res.json();
  const priceEntry = data?.data?.[0]?.prices?.find(p => p.currency === 'usd');
  return priceEntry ? parseFloat(priceEntry.value) : null;
}

// usage:
fetchTokenPrice('0xYourTokenAddress').then(price => {
  const el = document.querySelector('[data-token-price]');
  if (el && price !== null) el.textContent = `$${price.toFixed(4)}`;
});