import { CrmAuthController } from "./auth/crm/crm.auth.controller";
import { PanelAuthController } from "./auth/panel/panel.auth.controller";
import { CrmUserController } from "./user/crm/crm.user.controller";






export const AllControllers = [
    CrmAuthController,
    PanelAuthController,
    CrmUserController
]