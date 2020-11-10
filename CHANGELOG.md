# [6.9.0](https://github.com/dwp/gysp-agent-ui/compare/6.8.1...6.9.0) (2020-11-10)


### Features

* **no-inheritable-entitlement:** add 'no' route to widowhood journey ([3abc149](https://github.com/dwp/gysp-agent-ui/commit/3abc149c1fd57a7d2c2cbb432a34b8687dc2681e))
* **widow-task:** ability to process a widow task ([32dcf53](https://github.com/dwp/gysp-agent-ui/commit/32dcf5347561f42e6b080f5a7d90e6a360e13968))



## [6.8.1](https://github.com/dwp/gysp-agent-ui/compare/6.8.0...6.8.1) (2020-10-27)


### Bug Fixes

* **invalid-character-check:** add validation ([1233444](https://github.com/dwp/gysp-agent-ui/commit/1233444794cd0e5d4460a1ba47c8826e5cc7f09b))
* **manual-payment:** still show values if £0.00 ([a723e08](https://github.com/dwp/gysp-agent-ui/commit/a723e084eb0aaba81dfc33256cb3140784cb5fea))
* **widow-date:** update date used ([3a3db4b](https://github.com/dwp/gysp-agent-ui/commit/3a3db4b06e293786c6ed7efe462aaa23a04e6e74))


### Features

* **verify-spouse-dob:** add feature to verify spouse dob ([1e3130c](https://github.com/dwp/gysp-agent-ui/commit/1e3130ce63a2ecb674fcef6b4d93db9bb1238321))



# [6.8.0](https://github.com/dwp/gysp-agent-ui/compare/6.7.0...6.8.0) (2020-10-13)


### Features

* **death:** add warning for none verified death without dap details ([b417ec0](https://github.com/dwp/gysp-agent-ui/commit/b417ec05866a26a50f93b43dd3dca224e743bdcb))
* **death:** add warning for verified death without dap details ([b08247e](https://github.com/dwp/gysp-agent-ui/commit/b08247e027bcec50cee7bb44b08fc5944fdf9c1c))
* **manual-payment:** add journey to record manual payment ([eccf049](https://github.com/dwp/gysp-agent-ui/commit/eccf0499eccb56e7188097a81efeb44d62bd992d))



# [6.7.0](https://github.com/dwp/gysp-agent-ui/compare/6.6.0...6.7.0) (2020-09-30)


* chore!: upgrade node to 12.8.4 ([02f0cda](https://github.com/dwp/gysp-agent-ui/commit/02f0cdab6831e0e41d18c140ecac5b1b7f877f05))


### Bug Fixes

* **key-details:** make key details and nav more accessible ([131aabe](https://github.com/dwp/gysp-agent-ui/commit/131aabe7f9110d4ae50928bb2596515aecc2ce6b))


### Features

* **content:** add accessibility-statement page ([ac18eac](https://github.com/dwp/gysp-agent-ui/commit/ac18eac1475d2f5694030b479ca567300a98ff7e))


### BREAKING CHANGES

* * Drop support for node < 12.0.0
* Update alpine Docker image
* Delete .node-version file as Travis now can use .nvmrc
* Update Travis config

Jira SA-3112

Signed-off-by: Malcolm Hire <malcolm.hire@engineering.digital.dwp.gov.uk>



# [6.6.0](https://github.com/dwp/gysp-agent-ui/compare/6.5.0...6.6.0) (2020-09-14)


### Features

* **deferral:** created deferral journey ([3235d51](https://github.com/dwp/gysp-agent-ui/commit/3235d51adf815de9dfc0fc9026eb2bf15bb75243))
* **widow:** change award amounts ([fe33a8f](https://github.com/dwp/gysp-agent-ui/commit/fe33a8fe9eba49ebde374040007db486b3e365bb))



# [6.5.0](https://github.com/dwp/gysp-agent-ui/compare/6.4.0...6.5.0) (2020-09-02)


### Bug Fixes

* Allow LA addresses to be saved ([bff5e68](https://github.com/dwp/gysp-agent-ui/commit/bff5e6866958ea5581c629da34b0d1c6f3d53838))
* **task:** include updated verification status in request object ([88e0057](https://github.com/dwp/gysp-agent-ui/commit/88e00573f0c822c1abc773942ace1e14898192cd))


### Features

* Remove To label from award lists ([8d92bdb](https://github.com/dwp/gysp-agent-ui/commit/8d92bdba86a1ed09f20a2025fa66e1736289a54d))
* **marital:** record inheritable entitlement ([e57462f](https://github.com/dwp/gysp-agent-ui/commit/e57462f4e76cf835f75b6be23b285e0be778d700))



# [6.4.0](https://github.com/dwp/gysp-agent-ui/compare/6.3.0...6.4.0) (2020-08-18)


### Bug Fixes

* **html:** tidy up html ([2be5457](https://github.com/dwp/gysp-agent-ui/commit/2be54572b1868a20b5d9cf7858003146a0cf9937))
* **navigation:** fixed issue with GySP link is disabled ([6236dd9](https://github.com/dwp/gysp-agent-ui/commit/6236dd90adf41852e3777eb7b3d62a81bcb4aa6c))


### Features

* **status-change:** extended journey for widow inheritance ([372ffef](https://github.com/dwp/gysp-agent-ui/commit/372ffef981b249002f130dcd4617bc8612453109))
* **tasks:** add/change partner details entitlement ([11e1e52](https://github.com/dwp/gysp-agent-ui/commit/11e1e526eeb596405bedd4c61974416a95a9d931))



# [6.3.0](https://github.com/dwp/gysp-agent-ui/compare/6.2.0...6.3.0) (2020-08-03)


### Features

* extend work queue functionality for NI ([2637c81](https://github.com/dwp/gysp-agent-ui/commit/2637c81d7d2e47dcf110de94316e333acbb8fd7c))



# [6.2.0](https://github.com/dwp/gysp-agent-ui/compare/6.1.0...6.2.0) (2020-07-22)



# [6.1.0](https://github.com/dwp/gysp-agent-ui/compare/6.0.0...6.1.0) (2020-07-07)


### Bug Fixes

* fix nav link restricted service ([3abc514](https://github.com/dwp/gysp-agent-ui/commit/3abc514e13305350b3398348c287fd09353717b5))


### Features

* add nav for agent service ([a9139e9](https://github.com/dwp/gysp-agent-ui/commit/a9139e91e722a1083b9af28ca0dda0d6b975fa54))



# [6.0.0](https://github.com/dwp/gysp-agent-ui/compare/v5.31.0...6.0.0) (2020-07-02)


### Features

* **docker:** support ECS with docker ([0a760f7](https://github.com/dwp/gysp-agent-ui/commit/0a760f73f801f8da6ea959a582b13cb7d7d676e2))
* correct previous label on award details screen ([77d05af](https://github.com/dwp/gysp-agent-ui/commit/77d05afefa6597c48f2c9190a5353e5fe0d1b178))
* find someone page change to go to new page ([de5dc19](https://github.com/dwp/gysp-agent-ui/commit/de5dc19b2afc9bba9966f1f8f9cf511c6453e1b7))
* Moved to shared location service ([cda5f28](https://github.com/dwp/gysp-agent-ui/commit/cda5f282e36276018aee1d14d0f52e55c55749c6))


### BREAKING CHANGES

* **docker:** move to .env config within docker

Closes Jira SA-2724

Signed-off-by: Malcolm Hire <malcolm.hire@engineering.digital.dwp.gov.uk>



# [5.31.0](https://github.com/dwp/gysp-agent-ui/compare/v5.30.0...v5.31.0) (2020-06-23)


### Features

* change caption text for srb review if payments made ([e2895f9](https://github.com/dwp/gysp-agent-ui/commit/e2895f9f119b54db59fae96425ba9fc4728f9647))
* Don't display payment breakdowns on srb ([faa0b04](https://github.com/dwp/gysp-agent-ui/commit/faa0b0428b18063be04b590460549e01384908ef))
* Ensure entitlement date not in future ([632232b](https://github.com/dwp/gysp-agent-ui/commit/632232bcbb03a334806450c1544af8b30932b248))



# [5.30.0](https://github.com/dwp/gysp-agent-ui/compare/v5.29.0...v5.30.0) (2020-06-09)


### Features

* Updated personal json to add new timeline events in ([e157ea5](https://github.com/dwp/gysp-agent-ui/commit/e157ea5e499122a2cc727aa8b2a78afc0f2f0b74))
* **death:** NV to V show nothing owned review payee ([0ee897f](https://github.com/dwp/gysp-agent-ui/commit/0ee897f767f8d7a102f5ac61e39bacbb033fd8df))
* **death:** NV to V show overpayment review payee ([2e805f5](https://github.com/dwp/gysp-agent-ui/commit/2e805f51cc2beda825983cd3cff29285c493aaad))
* **death:** remove secondary nav ([b16dee1](https://github.com/dwp/gysp-agent-ui/commit/b16dee1014cac48b10d4e9d26d10f39956526d3a))
* **death:** retriggered death nothing owed review screen ([0d4dd4f](https://github.com/dwp/gysp-agent-ui/commit/0d4dd4f8cac349b16f73ffd3d91e64a05d8fdf7c))
* **death:** retriggered death overpayment review screen ([2be851d](https://github.com/dwp/gysp-agent-ui/commit/2be851da4c241328f24885118ba7c6f23a393ac0))
* **death:** update from NV to V show review payee ([9d6969c](https://github.com/dwp/gysp-agent-ui/commit/9d6969c2e133ede23eb5cf7ddd7890d48ad26039))



# [5.29.0](https://github.com/dwp/gysp-agent-ui/compare/v5.28.0...v5.29.0) (2020-05-26)


### Bug Fixes

* **death:** add validation for DAP name ([4b78c87](https://github.com/dwp/gysp-agent-ui/commit/4b78c8725375dab25994d300b61dd4ab8c25abf2))


### Features

* **death:** change recorded DAP details ([73eb5e5](https://github.com/dwp/gysp-agent-ui/commit/73eb5e59ea94f6a6eea5fc2b845f80b0e58e5f0b))
* **death:** retriggered death arrears BR330 screen ([73a1b8d](https://github.com/dwp/gysp-agent-ui/commit/73a1b8d3c140d0177b8f61c3d794ec9c08b0a03d))



# [5.28.0](https://github.com/dwp/gysp-agent-ui/compare/v5.27.0...v5.28.0) (2020-05-13)


### Features

* change style on personal table ([9f3108d](https://github.com/dwp/gysp-agent-ui/commit/9f3108d93a3997efc8b7d522d34b3770bd165ac7))
* **marital:** partner date of birth ([2520fa8](https://github.com/dwp/gysp-agent-ui/commit/2520fa8334ae1fcd6ed55d73725b2cab49053c80))



# [5.27.0](https://github.com/dwp/gysp-agent-ui/compare/v5.26.0...v5.27.0) (2020-04-28)


### Features

* **design:** add alerts to change enquiries ([2219056](https://github.com/dwp/gysp-agent-ui/commit/22190560cc24797a89e4233de81a3e8b04c47272))
* **marital:** change date ([d1b05fc](https://github.com/dwp/gysp-agent-ui/commit/d1b05fce6199373c19bd0043544fd3ec8b7b5e8a))
* **marital:** change status ([b0eb416](https://github.com/dwp/gysp-agent-ui/commit/b0eb416feee100eb02be42f25ce0e806fa2496e2))



# [5.26.0](https://github.com/dwp/gysp-agent-ui/compare/v5.25.0...v5.26.0) (2020-04-15)


### Bug Fixes

* use correct header for future first award ([d33ec7c](https://github.com/dwp/gysp-agent-ui/commit/d33ec7ccbb0d3c6303ae095bda408afb14414c2e))


### Features

* **marital:** add/update partner nino ([79e5d26](https://github.com/dwp/gysp-agent-ui/commit/79e5d266b73d1ab711ad8c6420a61efc862b4827))
* **marital:** change marital status for married and civil partnerdship ([6119d23](https://github.com/dwp/gysp-agent-ui/commit/6119d230ed2f4df7f6b58eaafde4c6ac5e4f874e))
* **tasks:** enable return to queue ([2f32657](https://github.com/dwp/gysp-agent-ui/commit/2f3265738fdcefc7516722f97185afc6a64e7f93))
* change style on personal table ([15084bf](https://github.com/dwp/gysp-agent-ui/commit/15084bf7ee127fcb544332f08a058d020700a0a0))



# [5.25.0](https://github.com/dwp/gysp-agent-ui/compare/v5.24.0...v5.25.0) (2020-04-02)


### Features

* **design:** update design of contact page ([a16761f](https://github.com/dwp/gysp-agent-ui/commit/a16761fe0d1c733eda51d5f654ab1cb874c1d88d))
* **marital:** marital status and partner ([b49bc8b](https://github.com/dwp/gysp-agent-ui/commit/b49bc8bee395b43ab2d1677579da79aad7ac2984))
* **payment:** dead returned payment ([2f64d2f](https://github.com/dwp/gysp-agent-ui/commit/2f64d2fb7d1d72ee6bbc592bd2b23cf33e92beab))
* **task:** add tasks module ([184c98e](https://github.com/dwp/gysp-agent-ui/commit/184c98e26a4416375bbe92e95d1c4c56fba6d410))
* **tasks:** update tasks functionality ([79df3f2](https://github.com/dwp/gysp-agent-ui/commit/79df3f208d07f230dba2e650f133d4dcce9aee9c))
* **tasks:** view and end tasks ([410a415](https://github.com/dwp/gysp-agent-ui/commit/410a4156f8fcf51059fdf8cc53e539f0d8ef24cd))



# [5.24.0](https://github.com/dwp/gysp-agent-ui/compare/v5.23.0...v5.24.0) (2020-03-18)


### Features

* **death:** change date format ([1f5ba00](https://github.com/dwp/gysp-agent-ui/commit/1f5ba00d9cebf71512276c7d41625bd2e474c341))
* **death:** check change ([49427b9](https://github.com/dwp/gysp-agent-ui/commit/49427b908546eb3256b354ca81b84158cf0f8129))
* **death:** check death not verified details ([6784613](https://github.com/dwp/gysp-agent-ui/commit/6784613b845a4a3f0f60bccd9551ed9c40c1210d))
* **death:** nothing owed check details ([51fd547](https://github.com/dwp/gysp-agent-ui/commit/51fd547f0873e664adfa64c51b1a715d7cd9aaa7))



# [5.23.0](https://github.com/dwp/gysp-agent-ui/compare/v5.22.0...v5.23.0) (2020-03-04)


### Features

* **death:** payee account details ([280a0da](https://github.com/dwp/gysp-agent-ui/commit/280a0da08b934da02eb4bd5078314183d4506b47))
* **payment:** remove last payment ([9321643](https://github.com/dwp/gysp-agent-ui/commit/93216436e72d6d05726eeaaac71fd8e9e5433aeb))



# [5.22.0](https://github.com/dwp/gysp-agent-ui/compare/v5.21.0...v5.22.0) (2020-02-19)


### Features

* **payment:** removed CPS local page ([89e429a](https://github.com/dwp/gysp-agent-ui/commit/89e429adefb1b0ee94efbe061637f16ef285e956))
* **review:** change entitlement date ([56f8abc](https://github.com/dwp/gysp-agent-ui/commit/56f8abc851a230bbbef7c5f65898d8e14433c855))
* **review-award:** new payment amounts ([0ee9288](https://github.com/dwp/gysp-agent-ui/commit/0ee9288194ad7b80b2f63a422b7d9512a0b80f9f))



# [5.21.0](https://github.com/dwp/gysp-agent-ui/compare/v5.20.0...v5.21.0) (2020-02-05)


### Features

* **death:** check details arrears ([8ad0aef](https://github.com/dwp/gysp-agent-ui/commit/8ad0aefa5d01f47a15f4c5102c80f17a22ff3d64))
* **death:** check details page with success alert ([1608d67](https://github.com/dwp/gysp-agent-ui/commit/1608d67b81e73e35c12b113e2216f29efdc24823))
* **death:** overpayment check details ([ba85a0e](https://github.com/dwp/gysp-agent-ui/commit/ba85a0e49aeea5177f3e8ef2bab2325c0cf998b8))



# [5.20.0](https://github.com/dwp/gysp-agent-ui/compare/v5.19.0...v5.20.0) (2020-01-22)


### Features

* **mockdate:** added ablity to mock the current date ([8cfff2e](https://github.com/dwp/gysp-agent-ui/commit/8cfff2e9b4f5b694991e2f0f42bde87ed07afa9f))
* **performance:** improvements ([5a6d6df](https://github.com/dwp/gysp-agent-ui/commit/5a6d6dfb9fa4fb805f726d2ad405bcd03f6b5073))
* add calculation for NV death to V death ([1bdfdb8](https://github.com/dwp/gysp-agent-ui/commit/1bdfdb8580d3dccfc4422d75347297f9e890a4b8))



# [5.19.0](https://github.com/dwp/gysp-agent-ui/compare/v5.18.0...v5.19.0) (2019-12-04)


### Features

* Reissue a recalled payment ([1516538](https://github.com/dwp/gysp-agent-ui/commit/15165389291576b2c670eb079fdf17bcded39a2e))
* **award:** add uprate details ([536aa09](https://github.com/dwp/gysp-agent-ui/commit/536aa098bac013df68c2495110c0a8f477a04769))
* **award:** award list and details ([9260fba](https://github.com/dwp/gysp-agent-ui/commit/9260fbab728d6d961b4d5c862c230b7fe0d70ae8))
* **scope:** remove payment schedule and hyperlink ([c70b499](https://github.com/dwp/gysp-agent-ui/commit/c70b499c51a1f28999ff39e17ba8c9500f237e13))
* remove link ([85aa416](https://github.com/dwp/gysp-agent-ui/commit/85aa4168decdc19a51a522576f06ee3b321c099e))



# [5.18.0](https://github.com/dwp/gysp-agent-ui/compare/v5.17.0...v5.18.0) (2019-11-20)


### Features

* **death:** overpayment and arrears calculation ([197d441](https://github.com/dwp/gysp-agent-ui/commit/197d44132b8995c88905f7605ede5c9a8333bdc0))
* death dap details ([25cf4f3](https://github.com/dwp/gysp-agent-ui/commit/25cf4f36645ed6a1b26c660c59baec0938ef7734))
* **death:** recalculate death arrears ([663afad](https://github.com/dwp/gysp-agent-ui/commit/663afad8ec1026349040c151395ab4231bfcfa1a))



# [5.17.0](https://github.com/dwp/gysp-agent-ui/compare/v5.16.0...v5.17.0) (2019-11-06)


### Features

* **payment:** add reissued status ([b602f66](https://github.com/dwp/gysp-agent-ui/commit/b602f661a81a114e39d1513247fca4ebea5d8e87))
* **payment:** reissue payment ([a34af90](https://github.com/dwp/gysp-agent-ui/commit/a34af90095796cf0c9d6e2aaa7f681d8525f02bb))
* **payment:** reissue status for timeline ([a762ef0](https://github.com/dwp/gysp-agent-ui/commit/a762ef005468e7ac0f0316d3afdcfd40915934ae))



# [5.16.0](https://github.com/dwp/gysp-agent-ui/compare/v5.15.0...v5.16.0) (2019-10-22)


### Bug Fixes

* **a11y:** fixed some a11y issues ([e07c550](https://github.com/dwp/gysp-agent-ui/commit/e07c550b1320797dcb518bae8977f011eea84418))


### Features

* **payment-status:** ability to set the payment status as recalling ([d796898](https://github.com/dwp/gysp-agent-ui/commit/d796898d98fe3567ec4916be45312cb708d3533a))
* **payment-status:** status update RECALLING to RECALLED or PAID ([d04c4fb](https://github.com/dwp/gysp-agent-ui/commit/d04c4fb6b94415304befd772036cca14b3a0a165))
* **timeline:** payment detail timeline for returned status ([58db641](https://github.com/dwp/gysp-agent-ui/commit/58db64158d9e130d8d632bcb35ffff179845ff91))
* **timeline:** update status timeline for recalling, recall ([af644ca](https://github.com/dwp/gysp-agent-ui/commit/af644caaa312b1606bf0b81299185ec5480dad71))



# [5.15.0](https://github.com/dwp/gysp-agent-ui/compare/v5.14.1...v5.15.0) (2019-10-10)


### Features

* **award:** current state pension award page ([b8b08d1](https://github.com/dwp/gysp-agent-ui/commit/b8b08d154f194fb1a418ffee00bf61ee3aaf9325))
* **payment-status:** ability to update status from  paid to not paid ([5c692ec](https://github.com/dwp/gysp-agent-ui/commit/5c692ecd752e005d56e5883ea56772e6d689047e))



## [5.14.1](https://github.com/dwp/gysp-agent-ui/compare/v5.14.0...v5.14.1) (2019-09-24)



# [5.14.0](https://github.com/dwp/gysp-agent-ui/compare/v5.13.0...v5.14.0) (2019-09-10)


### Features

* **payment-detail:** view payment details by payment id ([cd489f3](https://github.com/dwp/gysp-agent-ui/commit/cd489f395945aef059cec6cb0f32cd55028e132b))
* **payment-history:** more detailed payment history ([2742f84](https://github.com/dwp/gysp-agent-ui/commit/2742f84c6a0a947afc36b0b6606ff74eaeaa645d))



# [5.13.0](https://github.com/dwp/gysp-agent-ui/compare/v5.12.0...v5.13.0) (2019-08-27)


### Features

* **new-award:** screen to show new award to review ([eac9fe1](https://github.com/dwp/gysp-agent-ui/commit/eac9fe111c24ecc3c111d3eb25610104ccbb3fa0))
* **review-award:** payment breakdown and complete ([b2b1a52](https://github.com/dwp/gysp-agent-ui/commit/b2b1a52ed35828a8c175d3e208497032603cf510))
* **review-award:** review an award reason ([f8de485](https://github.com/dwp/gysp-agent-ui/commit/f8de485f15d5d76c5f4249f160676dccdcad330b))



# [5.12.0](https://github.com/dwp/gysp-agent-ui/compare/v5.11.0...v5.12.0) (2019-08-13)


### Features

* **payment:** add timeline to payment page ([6cab99d](https://github.com/dwp/gysp-agent-ui/commit/6cab99d59f94d67893cb8bf724bf2f5dad9a6085))
* **payment:** don't display next payment when null ([8f003a1](https://github.com/dwp/gysp-agent-ui/commit/8f003a14133af18d267e767744ccc2908ce35bf3))
* **payment:** payment details message displayed if empty ([34e4f9c](https://github.com/dwp/gysp-agent-ui/commit/34e4f9c4ff67e3267e74fc383686be1d19f211e1))
* **payment-history:** more detailed payment history ([a1c569f](https://github.com/dwp/gysp-agent-ui/commit/a1c569ffca5cef432283bed51e80438649fddc33))
* **personal:** add timeline feature to personal page ([953ecaa](https://github.com/dwp/gysp-agent-ui/commit/953ecaa6e8525277c8ba4c92227bb69a4ff374c5))
* **timeline:** contact timeline ([39d09f6](https://github.com/dwp/gysp-agent-ui/commit/39d09f6b5590af5d802b31c1f8e3111ed876bcf7))



# [5.11.0](https://github.com/dwp/gysp-agent-ui/compare/v5.10.0...v5.11.0) (2019-07-16)


### Features

* **award-review:** total awards to review ([945dd3e](https://github.com/dwp/gysp-agent-ui/commit/945dd3e9cd897e52cf1bed3933ffef90fbf3b48e))
* **death:** enter date of death ([830ceb1](https://github.com/dwp/gysp-agent-ui/commit/830ceb1de04686b78b636b8f83c688396984be14))
* **death:** verify date of death ([b9cbd26](https://github.com/dwp/gysp-agent-ui/commit/b9cbd261b7197d24101590eff3b64938e5fea28d))



# [5.10.0](https://github.com/dwp/gysp-agent-ui/compare/v5.9.0...v5.10.0) (2019-06-19)


### Bug Fixes

* **find-claim:** add form group to buttons for bottom margin ([b1f718d](https://github.com/dwp/gysp-agent-ui/commit/b1f718d779f025c488a737c23194f11357219926))


### Features

* **recent-payments:** recent payment table ([fe7a48b](https://github.com/dwp/gysp-agent-ui/commit/fe7a48b7bb668105c46dd173a1fd539fd2297ed7))



# [5.9.0](https://github.com/dwp/gysp-agent-ui/compare/v5.8.0...v5.9.0) (2019-06-05)


### Bug Fixes

* **kong:** update agentRef to use givenname and surname ([3180709](https://github.com/dwp/gysp-agent-ui/commit/3180709e3070e559b7ecc8c2e48cff555c8a7826))


### Features

* **contact:** move contact details to seprate page ([fd56f82](https://github.com/dwp/gysp-agent-ui/commit/fd56f8200a9fee2bd1525c05b2e2cf6db1d1f25b))
* **enter-amounts:** remove enter amounts screen ([ab7c264](https://github.com/dwp/gysp-agent-ui/commit/ab7c264f70506f258db03fdd8737928c319fca6b))
* **key-details:** new key details design ([1800c8c](https://github.com/dwp/gysp-agent-ui/commit/1800c8c09be87be5f309d793ee5b537564f717ad))
* **key-details:** new key details design ([bb60c37](https://github.com/dwp/gysp-agent-ui/commit/bb60c37e7708094438bd709e7e9e198ae953ae06))
* **personal:** convert overview to personal ([7dc4d41](https://github.com/dwp/gysp-agent-ui/commit/7dc4d41bfb1b721c6c9642ef3fd80980160866a3))



# [5.8.0](https://github.com/dwp/gysp-agent-ui/compare/v5.7.0...v5.8.0) (2019-05-22)


### Features

* **payment:** update 500 error message ([514b805](https://github.com/dwp/gysp-agent-ui/commit/514b80599198a72693f182ba05943fed7533a49e))



# 5.7.0 (2019-04-30)



