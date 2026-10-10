import type { Courier, Shipment } from "@/lib/types";

export const couriers: Courier[] = [
  { id: "cr_1", name: "Courier A", isActive: true, apiAvailable: false },
  { id: "cr_2", name: "Courier B", isActive: true, apiAvailable: false },
  { id: "cr_3", name: "Courier C", isActive: true, apiAvailable: false },
  { id: "cr_4", name: "Courier D", isActive: true, apiAvailable: false },
];

export const shipments: Shipment[] = [
  {
    id: "sh_1",
    orderId: "ord_1001",
    courierId: "cr_1",
    trackingNumber: "TRK-9F2K1",
    status: "Delivered",
    charges: { shipping: 200, cod: 60, return: 0 },
    events: [
      { at: "2026-10-08T14:00:00Z", description: "Picked up" },
      { at: "2026-10-09T10:15:00Z", description: "Delivered to customer" },
    ],
  },
  {
    id: "sh_2",
    orderId: "ord_1002",
    courierId: "cr_2",
    trackingNumber: "TRK-7XM4N",
    status: "In transit",
    charges: { shipping: 200, cod: 60, return: 0 },
    events: [{ at: "2026-10-08T16:00:00Z", description: "Picked up" }],
  },
];