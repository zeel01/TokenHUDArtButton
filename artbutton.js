Hooks.on("renderTokenHUD", (hud, html, token) => {
	console.debug(hud, html, token);
	let actor = game.actors.get(token.actorId);
	
	let artButton = document.createElement("div");
	artButton.classList.add("control-icon");
	artButton.classList.add("artwork-open");
	artButton.innerHTML = `<i class="fas fa-image fa-fw"></i>`
	artButton.title = "Click to view artwork. Right-click to view token image."
	$(artButton).click((event) => {
		new ImagePopout(actor.data.img, {
			title: actor.name,
			shareable: true,
			uuid: actor.uuid
		}).render(true);
	});
	$(artButton).contextmenu((event) => {
		new ImagePopout(token.img, {
			title: token.name,
			shareable: true,
		}).render(true);
	});
	
//	let tokenButton = document.createElement("div");
//	tokenButton.classList.add("control-icon");
//	tokenButton.classList.add("artwork-open");
//	tokenButton.innerHTML = `<i class="fas fa-user-circle"></i>`
//	$(tokenButton).click((event) => {
//		new ImagePopout(token.img, {
//			title: token.name,
//			shareable: true,
//		}).render(true);
//	});
	
	html.find("div.left").append(artButton);
//	html.find("div.right").append(tokenButton);
});