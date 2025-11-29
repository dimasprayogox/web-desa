import { Typography, Card, CardBody } from "@material-tailwind/react";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/solid";
 
export function ContactSection() {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Typography variant="h2" className="text-3xl lg:text-5xl font-bold text-blue-gray-900 mb-4">
            Hubungi Kami
          </Typography>
          <Typography variant="lead" className="text-gray-600 max-w-3xl mx-auto">
            Silakan hubungi kami untuk informasi lebih lanjut
          </Typography>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <Card className="mb-6">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold text-blue-gray-900 mb-2">
                      Alamat
                    </Typography>
                    <Typography className="text-gray-600">
                      Desa Krebet, Kecamatan Pilangkenceng<br />
                      Kabupaten Madiun, Jawa Timur 63154
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card className="mb-6">
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold text-blue-gray-900 mb-2">
                      Telepon
                    </Typography>
                    <Typography className="text-gray-600">
                      (0274) 123456<br />
                      +62 812-3456-7890
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <Typography variant="h6" className="font-bold text-blue-gray-900 mb-2">
                      Email
                    </Typography>
                    <Typography className="text-gray-600">
                      info@desakrebet.id<br />
                      admin@desakrebet.id
                    </Typography>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Map */}
          <div>
            <Card className="h-full">
              <CardBody className="p-0">
                <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24106.151777362906!2d111.60875526505356!3d-7.478355971053193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79c5d0659c569b%3A0x21cf7e884e14fb88!2sKrebet%2C%20Kec.%20Pilangkenceng%2C%20Kabupaten%20Madiun%2C%20Jawa%20Timur!5e1!3m2!1sid!2sid!4v1764337679159!5m2!1sid!2sid" 
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: "450px" }}
                  allowFullScreen
                  loading="lazy"
                  className="rounded-xl"
                ></iframe>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;