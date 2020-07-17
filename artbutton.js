Hooks.on("renderTokenHUD", (hud, html, token) => {
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

	html.find("div.left").append(artButton);
});