// File: umkm/components/UmkmCategories.jsx
import { Card, CardBody, Typography, List, ListItem } from "@material-tailwind/react";
import { TagIcon } from "@heroicons/react/24/solid";
import { mockKategoriUmkm } from "@/data/mockUmkm";

export function UmkmCategories({ selectedKategori, onSelectKategori }) {
  return (
    <Card className="sticky top-4">
      <CardBody>
        <div className="flex items-center gap-2 mb-4">
          <TagIcon className="h-5 w-5 text-orange-600" />
          <Typography variant="h6" className="font-bold">
            Kategori UMKM
          </Typography>
        </div>
        <List>
          <ListItem
            selected={selectedKategori === ""}
            onClick={() => onSelectKategori("")}
            className={`hover:bg-orange-50 transition-colors ${
              selectedKategori === "" ? "bg-orange-100 text-orange-900" : ""
            }`}
          >
            <div className="flex justify-between items-center w-full">
              <Typography className="font-medium">Semua Kategori</Typography>
              <Typography variant="small" className="text-gray-600">
                ({mockKategoriUmkm.reduce((sum, kat) => sum + kat.umkm_count, 0)})
              </Typography>
            </div>
          </ListItem>
          {mockKategoriUmkm.map((kat) => (
            <ListItem
              key={kat.id}
              selected={selectedKategori === kat.id.toString()}
              onClick={() => onSelectKategori(kat.id.toString())}
              className={`hover:bg-orange-50 transition-colors ${
                selectedKategori === kat.id.toString() ? "bg-orange-100 text-orange-900" : ""
              }`}
            >
              <div className="flex justify-between items-center w-full">
                <Typography className="font-medium">{kat.nama}</Typography>
                <Typography variant="small" className="text-gray-600">
                  ({kat.umkm_count})
                </Typography>
              </div>
            </ListItem>
          ))}
        </List>
      </CardBody>
    </Card>
  );
}

export default UmkmCategories;