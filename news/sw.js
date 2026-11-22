self.addEventListener('push', event => {
  let data = {
    title: 'Furnality News',
    body: 'Un nouvel article vient d’être publié.',
    url: '/news/index.html'
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: 'https://raw.githack.com/FurnalityNetwork/Asset/main/Assets/FAV/Fav%20-%20news.png',
      badge: 'https://raw.githack.com/FurnalityNetwork/Asset/main/Assets/FAV/Fav%20-%20news.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/news/index.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
      for (const client of windowClients) {
        if (client.url.includes('/news/') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return clients.openWindow(targetUrl);
    })
  );
});
