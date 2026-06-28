class ServiceAccount {
  type: string;
  projectId: string;
  privateKeyId: string;
  privateKey: string;
  clientEmail: string;
  clientId: string;
  authUri: string;
  tokenUri: string;
  authProviderX509CertUrl: string;
  clientX509CertUrl: string;
  universeDomain: string;

  constructor(data: Record<string, any>) {
    this.type = data?.default?.type;
    this.projectId = data?.default?.project_id;
    this.privateKeyId = data?.default?.private_key_id;
    this.privateKey = data?.default?.private_key;
    this.clientEmail = data?.default?.client_email;
    this.clientId = data?.default?.client_id;
    this.authUri = data?.default?.auth_uri;
    this.tokenUri = data?.default?.token_uri;
    this.authProviderX509CertUrl = data?.default?.auth_provider_x509_cert_url;
    this.clientX509CertUrl = data?.default?.client_x509_cert_url;
    this.universeDomain = data?.default?.universe_domain;
  }
}

export default ServiceAccount;
