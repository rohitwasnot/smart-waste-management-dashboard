const map = L.map("map").setView([12.9716, 77.5946], 11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap"
}).addTo(map);

/* Expanded Zones & Bin Data */
const zones = {
  Koramangala: {
    day: "Wednesday",
    time: "7:00 AM - 11:00 AM",
    vehicle: "BBMP KOR-12",
    bins: [
      { lat: 12.9352, lng: 77.6245, fill: 67, battery: 60, status: "Active" },
      { lat: 12.9346, lng: 77.6101, fill: 33, battery: 80, status: "Active" },
      { lat: 12.9310, lng: 77.6200, fill: 82, battery: 45, status: "Active" },
      { lat: 12.9380, lng: 77.6280, fill: 0, battery: null, status: "Inactive" }
    ]
  },

  Indiranagar: {
    day: "Monday",
    time: "6:00 AM - 10:00 AM",
    vehicle: "BBMP IND-08",
    bins: [
      { lat: 12.9719, lng: 77.6412, fill: 80, battery: 70, status: "Active" },
      { lat: 12.9784, lng: 77.6408, fill: 45, battery: null, status: "Active" },
      { lat: 12.9750, lng: 77.6500, fill: 60, battery: null, status: "Active" },
      { lat: 12.9690, lng: 77.6460, fill: 0, battery: null, status: "Inactive" }
    ]
  },

  Whitefield: {
    day: "Friday",
    time: "8:00 AM - 12:00 PM",
    vehicle: "BBMP WHF-21",
    bins: [
      { lat: 12.9698, lng: 77.7499, fill: 55, battery: 55, status: "Active" },
      { lat: 12.9562, lng: 77.7150, fill: 72, battery: 20, status: "Active" },
      { lat: 12.9650, lng: 77.7400, fill: 30, battery: 11, status: "Active" },
      { lat: 12.9600, lng: 77.7350, fill: 0, battery: 90, status: "Inactive" }
    ]
  },

  Yelahanka: {
    day: "Tuesday",
    time: "7:30 AM - 11:30 AM",
    vehicle: "BBMP YLK-05",
    bins: [
      { lat: 13.1007, lng: 77.5963, fill: 40, battery: 89, status: "Active" },
      { lat: 13.1080, lng: 77.5735, fill: 65, battery: 76, status: "Active" },
      { lat: 13.1050, lng: 77.5850, fill: 20, battery: 23, status: "Active" },
      { lat: 13.1100, lng: 77.5900, fill: 0, battery: 1, status: "Inactive" }
    ]
  },

  Jayanagar: {
    day: "Thursday",
    time: "6:30 AM - 10:30 AM",
    vehicle: "BBMP JYG-14",
    bins: [
      { lat: 12.9250, lng: 77.5938, fill: 50, battery: 45, status: "Active" },
      { lat: 12.9275, lng: 77.5800, fill: 78, battery: 4, status: "Active" },
      { lat: 12.9200, lng: 77.5900, fill: 35, battery: null, status: "Active" }
    ]
  },

  Malleshwaram: {
    day: "Saturday",
    time: "7:00 AM - 11:00 AM",
    vehicle: "BBMP MLR-09",
    bins: [
      { lat: 13.0030, lng: 77.5640, fill: 62, battery: 10, status: "Active" },
      { lat: 13.0060, lng: 77.5700, fill: 28, battery: null, status: "Active" },
      { lat: 13.0100, lng: 77.5680, fill: 0, battery: 11, status: "Inactive" }
    ]
  }
};

let markers = [];

function updateZone() {
  const zoneName = document.getElementById("zoneSelect").value;
  if (!zoneName) return;

  markers.forEach(m => map.removeLayer(m));
  markers = [];

  const z = zones[zoneName];

  document.getElementById("pickupDay").innerText = "📅 Day: " + z.day;
  document.getElementById("pickupTime").innerText = "⏰ Time: " + z.time;
  document.getElementById("vehicle").innerText = "🚛 Vehicle: " + z.vehicle;

  const notify = document.getElementById("notifications");
  notify.innerHTML = "";

  z.bins.forEach((bin, i) => {
    let color = "gray";

    if (bin.status === "Active") {
      color = bin.fill > 70 ? "red" :
              bin.fill > 40 ? "orange" : "green";

      if (bin.fill > 70) {
        notify.innerHTML += `<li>⚠ Bin ${i + 1} is ${bin.fill}% full</li>`;
      }
    } else {
      notify.innerHTML += `<li>❌ Bin ${i + 1} inactive</li>`;
    }

    const marker = L.circleMarker([bin.lat, bin.lng], {
      radius: 10,
      color,
      fillColor: color,
      fillOpacity: 0.9
    }).addTo(map);

    // 🔥 CLICK EVENT FOR BIN
    marker.on("click", () => showBinDetails(bin, zoneName));

    marker.bindPopup(`
      <b>Bin ${i + 1}</b><br>
      Status: ${bin.status}<br>
      Fill: ${bin.fill}%<br>
      Battery: ${bin.battery}%<br>
      Pickup: ${z.day}
    `);

    markers.push(marker);
  });

  notify.innerHTML += `<li>✅ Next pickup: ${z.day} (${z.time})</li>`;
  map.setView([z.bins[0].lat, z.bins[0].lng], 13);
}

function showBinDetails(bin, zoneName) {
  document.getElementById("binZone").innerText =
    "📍 Zone: " + zoneName;

  document.getElementById("binFill").innerText =
    "🗑 Fill Level: " + bin.fill + "%";

  document.getElementById("binStatus").innerText =
    "⚙ Status: " + bin.status;

  let batteryClass = "high";
  if (bin.battery < 30) batteryClass = "low";
  else if (bin.battery < 60) batteryClass = "medium";

  const batteryElem = document.getElementById("binBattery");
  batteryElem.innerText = "🔋 Battery: " + bin.battery + "%";
  batteryElem.className = batteryClass;
}
