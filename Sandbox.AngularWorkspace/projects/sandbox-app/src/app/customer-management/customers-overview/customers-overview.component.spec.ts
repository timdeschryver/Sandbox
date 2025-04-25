import { expect, it } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { render } from '@testing-library/angular';
import { CustomerOverviewResponse } from '@sandbox-app/customer-management/models';
import CustomersOverviewComponent from './customers-overview.component';
import { TestBed } from '@angular/core/testing';

it('renders the component with customers table', async () => {
	const mockCustomers: CustomerOverviewResponse[] = [
		{ id: 1, firstName: 'John', lastName: 'Doe' },
		{ id: 2, firstName: 'Jane', lastName: 'Smith' },
	];

	const { mockRequest, container } = await setup();

	await mockRequest(mockCustomers);

	expect(container).toMatchInlineSnapshot(`
		<div
		  id="root0"
		  ng-version="19.2.5"
		>
		  <div>
		    <h2>
		      Customers
		    </h2>
		    <sandbox-table
		      ng-reflect-resource="[object Object]"
		    >
		      <div>
		        <!--container-->
		        <table>
		          <thead>
		            <tr>
		              <th>
		                <button
		                  type="button"
		                >
		                  🔃
		                </button>
		              </th>
		              <th>
		                Name
		              </th>
		              <th />
		              <!--bindings={
		  "ng-reflect-ng-template-outlet": "[object Object]"
		}-->
		            </tr>
		          </thead>
		          <!--container-->
		          <tbody>
		            <!--container-->
		            <!--container-->
		            <div>
		              An unexpected error occurred, please try again.
		            </div>
		            <button
		              type="button"
		            >
		              Retry
		            </button>
		            <!--container-->
		          </tbody>
		          <!--container-->
		        </table>
		      </div>
		    </sandbox-table>
		  </div>
		  <sandbox-customer-form>
		    <form
		      class="ng-untouched ng-pristine ng-invalid"
		      novalidate=""
		    >
		      <h2>
		        Create Customer
		      </h2>
		      <!--container-->
		      <fieldset>
		        <legend>
		          Customer Information
		        </legend>
		        <div>
		          <label
		            for="firstName"
		          >
		            First Name
		          </label>
		          <input
		            class="ng-untouched ng-pristine ng-invalid"
		            id="firstName"
		            name="firstName"
		            ng-reflect-model=""
		            ng-reflect-name="firstName"
		            ng-reflect-required=""
		            required=""
		            type="text"
		          />
		          <form-validation-control-error
		            _nghost-a-c3901545631=""
		          >
		            <div
		              _ngcontent-a-c3901545631=""
		              class="error-message"
		              hidden=""
		            >
		              Field is required
		            </div>
		          </form-validation-control-error>
		          <!--container-->
		        </div>
		        <div>
		          <label
		            for="lastName"
		          >
		            Last Name
		          </label>
		          <input
		            class="ng-untouched ng-pristine ng-invalid"
		            id="lastName"
		            name="lastName"
		            ng-reflect-model=""
		            ng-reflect-name="lastName"
		            ng-reflect-required=""
		            required=""
		            type="text"
		          />
		          <form-validation-control-error
		            _nghost-a-c3901545631=""
		          >
		            <div
		              _ngcontent-a-c3901545631=""
		              class="error-message"
		              hidden=""
		            >
		              Field is required
		            </div>
		          </form-validation-control-error>
		          <!--container-->
		        </div>
		      </fieldset>
		      <div>
		        <input
		          id="hasBillingAddress"
		          name="hasBillingAddress"
		          type="checkbox"
		        />
		        <label
		          for="hasBillingAddress"
		        >
		          Add Billing Address
		        </label>
		      </div>
		      <!--container-->
		      <div>
		        <input
		          id="hasShippingAddress"
		          name="hasShippingAddress"
		          type="checkbox"
		        />
		        <label
		          for="hasShippingAddress"
		        >
		          Add Shipping Address
		        </label>
		      </div>
		      <!--container-->
		      <button
		        type="submit"
		      >
		        <!--container-->
		         Create Customer 
		        <!--container-->
		      </button>
		    </form>
		  </sandbox-customer-form>
		</div>
	`);
});
async function setup() {
	const { fixture, container } = await render(CustomersOverviewComponent, {
		providers: [provideHttpClient(), provideHttpClientTesting()],
	});

	const httpMock = TestBed.inject(HttpTestingController);
	return {
		container,
		mockRequest: async (response: object) => {
			const request = httpMock.expectOne('/api/customers');
			request.flush(response);

			await fixture.whenStable();
			fixture.detectChanges();

			return request;
		},
	};
}
