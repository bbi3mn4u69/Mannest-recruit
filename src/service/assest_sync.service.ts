import prisma from "~/lib/prisma";
import { status } from "@prisma/client";
import dayjs from "dayjs";

interface recordResDataType {
  type: string;
  serial: string;
  status: string;
  description: string;
  created_at: number;
  updated_at: number;
  location_id: number;
  id: number;
}

export const SyncService = {
  async SyncRecordFromAPI(datas: recordResDataType[]) {
    // Group assets by location_id
    const groupedByLocation = datas.reduce(
      (acc, data) => {
        if (!acc[data.location_id]) {
          acc[data.location_id] = [];
        }
        (acc[data.location_id] as recordResDataType[]).push(data);
        return acc;
      },
      {} as Record<number, recordResDataType[]>,
    );

    for (const [locationId, assets] of Object.entries(groupedByLocation)) {
      await prisma.location.create({
        data: {
          location_Id: parseInt(locationId), 
          assets: {
            create: assets.map((asset) => ({
              type: asset.type,
              serial: asset.serial,
              description: asset.description,
              status:
                asset.status === "actived" ? status.actived : status.inactived,
              assetsCreatedAt: dayjs.unix(asset.created_at).toDate(),
              assetsUpdatedAt: dayjs.unix(asset.updated_at).toDate(),
            })),
          },
        },
      });
    }
  },
};
